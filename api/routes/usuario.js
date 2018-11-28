const express = require('express');
const validator = require('validator');
const router = express.Router();
const con = require('../../database');
const crypto = require('crypto');
//const key = 'ciw7p02f70000ysjon7gztjn7';

router.get('/', (req, res, next) => {
	const categorias = con.query("SELECT * FROM usuario U JOIN consumidor C ON C.usuario_idusuario = U.idusuario", function (err, result, fields) {
		if (err) {
			res.status(200).json({
				erro: err
			});
		}
		else{
			res.status(200).json(result);
		}
	});
});

router.get('/custom/rank', (req, res, next) => {
	const categorias = con.query("SET @rank = 0; SELECT @rank:=@rank+1 AS rank, idconsumidor AS 'IDCONSUMIDOR', (SELECT COUNT(*) FROM pedido WHERE consumidor_idconsumidor = idconsumidor) AS 'PEDIDOS' FROM consumidor ORDER BY PEDIDOS DESC;", function (err, result, fields) {
		if (err) {
			res.status(200).json({
				erro: err
			});
		}
		else{
			res.status(200).json(result[1]);
		}
	});
});

router.get('/:login', (req, res, next) => {
	const login = validator.trim(validator.escape(req.params.login));

	const categorias = con.query("SELECT * FROM usuario U JOIN consumidor C ON C.usuario_idusuario = U.idusuario WHERE U.login = '" + login + "'", function (err, result, fields) {
		if (err) {
			res.status(200).json({
				erro: err
			});
		}
		else{
			res.status(200).json(result);
		}
	});
});

router.post('/', (req, res, next) => {
	const usuario = {
		login: req.body.login,
		email: req.body.email,
		senha: req.body.senha
	};

	const categorias = con.query("INSERT INTO usuario(idusuario, login, email, senha, tipo_usuario, ativo, reg_creation) VALUES(NULL, '" + usuario.login + "', '" + usuario.email + "', '" + usuario.senha + "', 'C', 0, NOW())", function (err, result, fields) {
		if (err) {
			res.status(201).json({
				retorno: false,
				erro: err
			});
		}
		else{
			res.status(201).json(result);
		}
	});
});

router.get('/:usuarioId', (req, res, next) => {
	const id = parseInt(validator.trim(validator.escape(req.params.usuarioId)));
	const categorias = con.query("SELECT idusuario, login, senha, email, ativo FROM usuario WHERE idusuario = " + id, function (err, result, fields) {

		if (err) {
			res.status(200).json({
				retorno: false,
				erro: err
			});
		}
		else{
			res.status(200).json({
				codigo: result[0]['idusuario'],
				login: result[0]['login'],
				senha: result[0]['senha'],
				email: result[0]['email'],
				ativo: result[0]['ativo']
			});
		}
	});
});

router.get('/login/:login/:senha', (req, res, next) => {
	const login = validator.trim(validator.escape(req.params.login));
	const senha = validator.trim(validator.escape(req.params.senha));

	//NÃO RETORNAR DADOS DO SELECT NA REQUEST, APENAS UMA CONFIRMAÇÃO

	const categorias = con.query("SELECT idusuario, login, senha, email, ativo FROM usuario WHERE login = '" + login + "' AND senha = '" + senha + "'", function (err, result, fields) {
		if (err) {
			res.status(200).json({
				erro: err
			});
		}
		else{
			res.status(200).json({
				retorno: result.length
			});
		}
	});
});

router.patch('/:usuarioId', (req, res, next) => {
	const id = parseInt(validator.trim(validator.escape(req.params.usuarioId)));
	const usuario = {
		login: req.body.login,
		email: req.body.email,
		senha: req.body.senha
	};

	const categorias = con.query("UPDATE usuario SET login = '" + usuario.login + "', email = '" + usuario.email + "', senha = '" + usuario.senha + "' WHERE idusuario = " + id, function (err, result, fields) {
		if (err) {
			res.status(201).json({
				erro: err
			});
		}
		else{
			res.status(201).json(result);
		}
	});
});

router.delete('/:usuarioId', (req, res, next) => {
	const id = parseInt(validator.trim(validator.escape(req.params.usuarioId)));

	const categorias = con.query("DELETE FROM usuario WHERE idusuario = " + id, function (err, result, fields) {
		if (err) {
			res.status(200).json({
				erro: err
			});
		}
		else{
			res.status(200).json({
				retorno: 'Usuario excluido com sucesso!',
				id: req.params.usuarioId
			});
		}
	});
});

module.exports = router;