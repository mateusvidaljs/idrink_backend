const express = require('express');
const validator = require('validator');
const router = express.Router();
const con = require('../../database');

router.get('/', (req, res, next) => {
	const categorias = con.query("SELECT * FROM sugestao", function (err, result, fields) {
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
	const sugestao = {
		usuario: req.body.usuario,
		tipo: req.body.tipo,
		texto: req.body.texto
	};

	const categorias = con.query("INSERT INTO sugestao VALUES(NULL, " + sugestao.usuario + ", '" + sugestao.tipo + "', '" + sugestao.texto + "', NOW())", function (err, result, fields) {
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

router.get('/:sugestId', (req, res, next) => {
	const id = parseInt(validator.trim(validator.escape(req.params.categoriaId)));
	const categorias = con.query("SELECT * FROM categoria_produto WHERE idcategoriaproduto = " + id, function (err, result, fields) {
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

router.patch('/:sugestId', (req, res, next) => {
	res.status(200).json({
		retorno: 'Produto Atualizado!'
	});
});

router.delete('/:sugestId', (req, res, next) => {
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