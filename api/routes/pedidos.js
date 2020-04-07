const express = require('express');
const validator = require('validator');
const router = express.Router();
const con = require('../../database');

router.get('/', (req, res, next) => {
	const sql = con.query("SELECT * FROM pedido", function (err, result, fields) {
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
	const pedido = {
		idconsumidor: req.body.idconsumidor,
		idendereco: req.body.idendereco,
		status: 'A',
		formapagamento: req.body.formapagamento,
		precototal: parseFloat(req.body.precototal),
		pago: 0
	};
	
	const sql = con.query("INSERT INTO pedido VALUES(NULL, " + pedido.idconsumidor + ", " + pedido.idendereco + ", '" + pedido.status + "', '" + pedido.formapagamento + "',  " + pedido.precototal + ", " + pedido.pago + ")", function (err, result, fields) {
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

router.post('/item', (req, res, next) => {
	const detalhes_pedido = {
		idpedido: parseInt(req.body.idpedido),
		idproduto: parseInt(req.body.idproduto),
		quantidade: parseInt(req.body.quantidade),
		obs: req.body.obs
	};
	
	const sql = con.query("INSERT INTO detalhes_pedido VALUES(NULL, " + detalhes_pedido.idpedido + ", " + detalhes_pedido.idproduto + ", " + detalhes_pedido.quantidade + ", '" + detalhes_pedido.obs + "')", function (err, result, fields) {
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

router.get('/item/:pedidoId', (req, res, next) => {
	const id = parseInt(validator.trim(validator.escape(req.params.pedidoId)));
	const categorias = con.query("SELECT * FROM detalhes_pedido WHERE pedido_idpedido = " + id, function (err, result, fields) {
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

router.patch('/:pedidoId', (req, res, next) => {
	const id = parseInt(validator.trim(validator.escape(req.params.pedidoId)));

	const pedido = {
		idconsumidor: req.body.idconsumidor,
		idendereco: req.body.idendereco,
		status: 'A',
		formapagamento: req.body.formapagamento,
		precototal: parseFloat(req.body.precototal),
		pago: 0
	};
	
	const sql = con.query("UPDATE pedido SET consumidor_idconsumidor = " + pedido.idconsumidor + ", endereco_idendereco = " + pedido.idendereco + ", status = '" + pedido.status + "', forma_pagamento = '" + pedido.formapagamento + "', precototl = " + pedido.precototal + ", pago = " + pedido.pago + ")", function (err, result, fields) {
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

router.delete('/:categoriaId', (req, res, next) => {
	const id = parseInt(validator.trim(validator.escape(req.params.categoriaId)));

	const categorias = con.query("DELETE FROM categoria_produto WHERE idcategoriaproduto = " + id, function (err, result, fields) {
		if (err) {
			res.status(200).json({
				erro: err
			});
		}
		else{
			res.status(200).json({
				retorno: 'Categoria excluida com sucesso!',
				id: req.params.categoriaId
			});
		}
	});
});

module.exports = router;