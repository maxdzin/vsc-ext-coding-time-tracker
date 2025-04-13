const fs = require('fs');
const path = require('path');
const os = require('os');

// Simple list of professional project names
const projects = [
    'React Dashboard',
    'Node.js API',
    'Mobile App',
    'Database Migration',
    'UI Components',
    'Backend Service',
    'Documentation',
    'Testing Suite',
    'DevOps Setup',
    'Data Analytics'
];

// Function to generate test data
function generateTestData() {
    const today = new Date();
    const entries = [];

    // Generate data for the last 90 days
    for (let i = 0; i < 90; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        // Generate 1-3 entries per day
        const entriesCount = Math.floor(Math.random() * 3) + 1;
        
        for (let j = 0; j < entriesCount; j++) {
            const project = projects[Math.floor(Math.random() * projects.length)];
            // Random time between 30 minutes and 4 hours (in minutes)
            const timeSpent = Math.floor(Math.random() * 210) + 30;
            
            entries.push({
                date: dateString,
                project,
                timeSpent
            });
        }
    }

    // Add some special test cases
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
    const todayString = today.toISOString().split('T')[0];

    // Add a long session for yesterday
    entries.push({
        date: yesterdayString,
        project: 'Node.js API',
        timeSpent: 480 // 8 hours
    });

    // Add multiple sessions for today
    entries.push({
        date: todayString,
        project: 'React Dashboard',
        timeSpent: 120 // 2 hours
    });
    entries.push({
        date: todayString,
        project: 'Documentation',
        timeSpent: 60 // 1 hour
    });

    return entries;
}

// Function to update the global state
function updateGlobalState() {
    const vscodeDir = path.join(os.homedir(), '.vscode');
    const globalStoragePath = path.join(vscodeDir, 'globalStorage');
    const extensionId = 'noorashuvo.simple-coding-time-tracker';
    const extensionStoragePath = path.join(globalStoragePath, extensionId);
    const storagePath = path.join(extensionStoragePath, 'globalState.json');

    try {
        console.log('Generating test data...');
        const testData = generateTestData();
        console.log(`Generated ${testData.length} time entries`);

        // Create directories if they don't exist
        if (!fs.existsSync(vscodeDir)) {
            fs.mkdirSync(vscodeDir);
        }
        if (!fs.existsSync(globalStoragePath)) {
            fs.mkdirSync(globalStoragePath);
        }
        if (!fs.existsSync(extensionStoragePath)) {
            fs.mkdirSync(extensionStoragePath);
        }

        // Read existing global state or create new one
        let globalState = {};
        if (fs.existsSync(storagePath)) {
            globalState = JSON.parse(fs.readFileSync(storagePath, 'utf8'));
        }

        // Update the timeEntries
        globalState.timeEntries = testData;

        // Write back to file
        fs.writeFileSync(storagePath, JSON.stringify(globalState, null, 2));
        console.log('\n✅ Test data has been generated and saved successfully!');
        console.log(`📁 Data file location: ${storagePath}`);
        console.log('🔄 Please reload VS Code to see the changes');
    } catch (error) {
        console.error('❌ Error updating global state:', error);
    }
}

// Run the script
updateGlobalState(); 