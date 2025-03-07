import { seedUserProfiles } from './userprofile-seeds.js';
import { seedSessions } from './session-seeds.js';

import sequelize from '../config/connection.js';

const seedAll = async (): Promise<void> => {
   try{
         await sequelize.sync({force: true});
         console.log('\n----- DATABASE SYNCED -----\n');
        
         await seedUserProfiles();
         console.log('\n----User profiles seeded----/n');      

         await seedSessions();
         console.log('\n----Sessions seeded----/n');
         process.exit(0);

    } 
        catch(error) {
        console.log('Error seeding database: ',error);
        process.exit(1);
    }
   };

seedAll();
