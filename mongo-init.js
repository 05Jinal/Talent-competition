// MongoDB initialization script
// This creates the application user for TalentDb with SCRAM-SHA-1 mechanism

db = db.getSiblingDB('TalentDb');

// Create application user with explicit SCRAM-SHA-1 mechanism for compatibility with older MongoDB drivers
db.createUser({
  user: 'TalentAppUser',
  pwd: 'm4tWXQC',
  roles: [
    {
      role: 'readWrite',
      db: 'TalentDb'
    }
  ],
  mechanisms: ['SCRAM-SHA-1', 'SCRAM-SHA-256']
});

print('MongoDB user TalentAppUser created successfully with SCRAM-SHA-1 and SCRAM-SHA-256 support');
