import { getConnection } from '../database/connection.js'
import sql from 'mssql'

export const getProducts = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM products");
    res.json(result.recordset);
}

export const getProduct = async (req, res) => {
    const pool = await getConnection();
    const result = await pool
        .request()
        .input('id', sql.Int, req.params.id)
        .query('SELECT * FROM products WHERE id = @id');

    console.log(result)
    res.json(result.recordset);
}

export const createProduct = async (req, res) => {
    console.log(req.body)

    const pool = await getConnection();
    const result = await pool
        .request()
        .input('name', sql.VarChar, req.body.name)
        .input('description', sql.Text, req.body.description)
        .input('price', sql.Decimal, req.body.price)
        .input('quantity', sql.Int, req.body.quantity)
        .query(
            `INSERT INTO products (name, description, price, quantity) VALUES (@name, @description, @price, @quantity);
            SELECT SCOPE_IDENTITY() AS id;`
        );

    console.log(result)

    res.json( { 
        id: result.recordset[0].id,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        description: req.body.description
    } )
}

export const updateProduct = async (req, res) => {
    const pool = await getConnection();
    const result = await pool
        .request()
        .input('id', sql.Int, req.params.id)
        .input('name', sql.VarChar, req.body.name)
        .input('description', sql.Text, req.body.description)
        .input('price', sql.Decimal, req.body.price)
        .input('quantity', sql.Int, req.body.quantity)
        .query("UPDATE products SET name = @name, quantity = @quantity, price = @price, description = @description WHERE id = @id;");

        console.log(result);

    if (result.rowsAffected[0] == 0) {
        return res.status(404).json( { message: "Product not found" } )
    }; 
    
    res.json( { message: "Product updated" } )
}

export const deleteProduct = async (req, res) => {
    const pool = await getConnection();
    const result = await pool
        .request()
        .input('id', sql.Int, req.params.id)
        .query("DELETE FROM products WHERE id = @id");
    
    console.log(result);

    if (result.rowsAffected[0] == 0) {
        return res.status(404).json( { message: "Product not found" } )
    }; 

    return res.json( { message: "Product deleted" } )
}