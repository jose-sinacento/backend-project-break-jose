const bcrypt = require('bcryptjs');
const User = require('../users/user');

const baseHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title> Inicia Sesión </title>
        <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
`;

const getNavBar = () => {
    return `
        <nav>
            <!-- Inserir HTML da barra de navegação aqui -->
        </nav>
    `;
};

const authController = {
    showLoginForm: (req, res) => {
        const loginFormHtml = `
            ${baseHtml}
            ${getNavBar()}
            <div class="login-container">
                <div class="login-box">
                    <h2>Inicia sesión</h2>
                    <form action="/login" method="post">
                        <div class="form-control">
                            <input type="email" id="email" name="email" required>
                            <label for="email">Email*</label>
                        </div>
                        <div class="form-control">
                            <input type="password" id="password" name="password" required>
                            <label for="password">Contraseña*</label>
                        </div>
                        <a href="#" class="forgot-password">¿Has olvidado la contraseña?</a>
                        <button type="submit">Acceder</button>
                    </form>
                </div>
            </div>
        </body>
        </html>
        `;
        res.send(loginFormHtml);
    },

    showRegistrationForm: (req, res) => {
        const registrationFormHtml = `
            ${baseHtml}
            ${getNavBar()}
            <div class="login-container"> <!-- Reutilize a classe de estilo do container de login -->
                <div class="login-box"> <!-- Reutilize a classe de estilo da caixa de login -->
                    <h2>Registra tu cuenta</h2>
                    <form action="/registro" method="post">
                        <div class="form-control">
                            <input type="email" id="email" name="email" required>
                            <label for="email">Email*</label>
                        </div>
                        <div class="form-control">
                            <input type="password" id="password" name="password" required>
                            <label for="password">Contraseña*</label>
                        </div>
                        <div class="form-control">
                            <input type="password" id="confirm-password" name="confirm-password" required>
                            <label for="confirm-password">Confirmar Contraseña*</label>
                        </div>
                        <button type="submit">Registrar</button>
                    </form>
                </div>
            </div>
        </body>
        </html>
        `;
        res.send(registrationFormHtml);
    },

    processRegistration: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Verifica se o email já está cadastrado
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).send('O email já está em uso');
            }

            // Hash da senha antes de salvar no banco de dados
            const hashedPassword = await bcrypt.hash(password, 10);

            // Cria um novo usuário com o email e a senha fornecidos
            const newUser = new User({ email, password: hashedPassword });

            // Salva o novo usuário no banco de dados
            await newUser.save();

            res.status(201).send('Usuario registrado exitosamente');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno al registrar usuario');
        }
    },

    processLogin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (user && bcrypt.compareSync(password, user.password)) {
                // Credenciais válidas
                req.session.userId = user._id;
                res.redirect('/dashboard');
            } else {
                // Credenciais inválidas
                res.status(401).send('Credenciales no válidas');
            }
        } catch (error) {
            res.status(500).send('Error interno');
        }
    },

    processLogout: (req, res) => {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    }
};

module.exports = authController;