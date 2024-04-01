const connection = require("../config/database");

class ModelUserResep {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM Resep ORDER BY id_resep DESC",
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static async addToFavorites(userId, resepId) {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO Favorit (id_users, id_resep) VALUES (?, ?)",
        [userId, resepId],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.affectedRows > 0); // Mengembalikan true jika berhasil dimasukkan
          }
        }
      );
    });
  }


  static async getById(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM Resep WHERE id_resep = ?",
        id,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows[0]);
          }
        }
      );
    });
  }

  static async create(data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO Resep SET ?",
        data,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.insertId);
          }
        }
      );
    });
  }

  static async update(id, data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE Resep SET ? WHERE id_resep = ?",
        [data, id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.affectedRows > 0);
          }
        }
      );
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM Resep WHERE id_resep = ?",
        id,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.affectedRows > 0);
          }
        }
      );
    });
  }

  static async getFavoriteRecipes(userId) {
    try {
      const query = 'SELECT * FROM Resep INNER JOIN Favorit ON Resep.id_resep = Favorit.id_resep WHERE Favorit.id_users = ?';
      return new Promise((resolve, reject) => {
        connection.query(query, [userId], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    } catch (error) {
      throw error;
    }
  }
}


module.exports = ModelUserResep;
