/*
	Import das bibliotecas
*/
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const expressValidator = require('express-validator');
const expressSession = require('express-session');


/*
	Caminho das rotas
*/
const categoriasRoutes = require('./api/routes/categorias');
const produtosRoutes = require('./api/routes/produtos');
const usuarioRoutes = require('./api/routes/usuario');
const sugestoesRoutes = require('./api/routes/sugestoes');
const pedidosRoutes = require('./api/routes/pedidos');
const indicaoresRoutes = require('./api/routes/indicadores');

app.use(helmet());
app.use(helmet.noSniff());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use(bodyParser.json());
app.use(expressSession({secret: 'merlin', saveUninitialized: false, resave: false}));

/*
	Setup para proteção CORS
*/
// * -> Está dando acesso a todos os clients
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers", 
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);

	if(req.method === 'OPTIONS'){
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}

	next();
});

app.use('/categorias', categoriasRoutes);
app.use('/produtos', produtosRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/sugestoes', sugestoesRoutes);
app.use('/pedidos', pedidosRoutes);
app.use('/indicadores', indicaoresRoutes);

/*
	Tratamento de Erros
*/
app.use((req, res, next) => {
	const error = new Error('Não foi possível encontrar o método!');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		erro: {
			retorno: error.message
		}
	});
});


module.exports = app;