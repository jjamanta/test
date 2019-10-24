import Sequelize, { Model } from 'sequelize';

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        age: Sequelize.INTEGER,
        height: Sequelize.DECIMAL(10, 2),
        weight: Sequelize.DECIMAL(10, 3),
      },
      {
        sequelize,
      }
    );
  }
}

export default Student;
