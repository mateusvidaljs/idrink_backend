const express = require('express');
const validator = require('validator');
const router = express.Router();
const con = require('../../database');

router.get('/', (req, res, next) => {
	const categorias = con.query("SELECT * FROM categoria_produto", function (err, result, fields) {
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
	const categoria = {
		codigo: req.body.codigo,
		categoria: req.body.categoria,
		subcategoria: req.body.subcategoria
	};

	const categorias = con.query("INSERT INTO categoria_produto(idcategoriaproduto, codigo, subcategoria, categoria, reg_creation) VALUES(NULL,'"+categoria.codigo+"','"+categoria.subcategoria+"','"+categoria.categoria+"',NOW())", function (err, result, fields) {
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

router.get('/:categoriaId', (req, res, next) => {
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

router.patch('/:categoriaId', (req, res, next) => {
	res.status(200).json({
		retorno: 'Produto Atualizado!'
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