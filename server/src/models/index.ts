import sequelize from '../config/connection.js';
import {UserFactory } from './userprofile.js';
import {SessionFactory} from './session.js';


const User = UserFactory(sequelize);
const Session = SessionFactory(sequelize);

User.hasMany(Session, {foreignKey: 'menteeId'});
Session.belongsTo(User, {foreignKey: 'menteeId'});

export { User, Session };
