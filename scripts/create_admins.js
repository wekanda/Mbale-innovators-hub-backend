#!/usr/bin/env node
// scripts/create_admins.js
// Creates or updates admin and supervisor users using the project's .env MONGO_URI

require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../src/models/User');

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not found in environment. Make sure .env exists and contains MONGO_URI');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const accounts = [
      {
        name: 'Admin User',
        email: 'admin@mbalehub.com',
        password: 'Admin@12345',
        role: 'admin',
      },
      {
        name: 'Supervisor User',
        email: 'supervisor@mbalehub.com',
        password: 'Supervisor@12345',
        role: 'supervisor',
      },
    ];

    for (const acc of accounts) {
      let user = await User.findOne({ email: acc.email }).select('+password');
      if (user) {
        user.name = acc.name;
        user.role = acc.role;
        user.password = acc.password; // will be hashed by pre-save
        await user.save();
        console.log(`Updated ${acc.role}: ${acc.email} (password reset)`);
      } else {
        user = new User({
          name: acc.name,
          email: acc.email,
          password: acc.password,
          role: acc.role,
        });
        await user.save();
        console.log(`Created ${acc.role}: ${acc.email}`);
      }
    }

    console.log('\nCredentials created/updated:');
    accounts.forEach(a => console.log(`- ${a.role.toUpperCase()}: ${a.email} / ${a.password}`));

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

main();
