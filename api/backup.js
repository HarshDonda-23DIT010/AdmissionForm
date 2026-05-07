import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      // Data received from the form
      const newData = req.body;
      
      // We aim for public/backup.json
      const filePath = path.join(process.cwd(), 'public', 'backup.json');
      
      let backup = [];
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        if (fileContent.trim() !== '') {
          backup = JSON.parse(fileContent);
        }
      }
      
      // Add the new inquiry to the beginning of the array
      backup.unshift(newData);
      
      // Write back to the file
      // NOTE: This works perfectly in local development.
      // On Vercel, the file system is read-only or ephemeral, meaning this will
      // succeed during the function execution but will NOT persist across sessions.
      fs.writeFileSync(filePath, JSON.stringify(backup, null, 2));
      
      res.status(200).json({ success: true, message: 'Backup updated successfully' });
    } catch (error) {
      console.error('Backup error:', error);
      res.status(500).json({ success: false, error: 'Failed to update backup file.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
