const { generateToken } = require("../shared/utils/jwt");
const User = require("../shared/models/User");
const bcrypt = require("bcryptjs");

/**
 * POST /auth/register
 */
const register = async (req, res) => {
  try {
    const { username, email, password, documentNumber } = req.body;

    // 1. Verificar si el usuario ya existe por email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: "El usuario ya existe",
        timestamp: new Date().toISOString(),
        status: "error",
      });
    }

    // 2. Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Normalizar documentNumber: si viene vacío, lo dejamos como null
    const sanitizedDocumentNumber =
      documentNumber && documentNumber.trim() !== ""
        ? documentNumber.trim()
        : null;

    // 4. Crear nuevo usuario en la base de datos
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      documentNumber: sanitizedDocumentNumber,
      isActive: true,
    });

    // 5. Generar JWT
    const token = generateToken({ userId: newUser.id, version: "v1" });

    // 6. Respuesta exitosa (el front usa data.token)
    return res.status(201).json({
      message: "Usuario registrado exitosamente",
      timestamp: new Date().toISOString(),
      status: "success",
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error en registro:", error);

    // Manejo especial para errores de UNIQUE en documentNumber o email
    if (error.name === "SequelizeUniqueConstraintError") {
      let campo = "campo único";
      if (error.fields?.email) campo = "email";
      if (error.fields?.documentNumber) campo = "documento";

      return res.status(400).json({
        message: `El ${campo} ya está registrado`,
        timestamp: new Date().toISOString(),
        status: "error",
      });
    }

    // Error genérico
    return res.status(500).json({
      message: "Error interno del servidor",
      timestamp: new Date().toISOString(),
      status: "error",
      error: error.message || String(error),
    });
  }
};

/**
 * POST /auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email, isActive: true },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Email o contraseña inválidos",
        status: "error",
      });
    }

    const token = generateToken({ userId: user.id, version: "v1" });

    return res.json({
      status: "success",
      message: "Login exitoso",
      timestamp: new Date().toISOString(),
      token, // 👈 mismo nombre que en register
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      status: "error",
      error: error.message || String(error),
    });
  }
};

module.exports = {
  login,
  register,
};
