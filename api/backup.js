import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
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
      const newData = req.body;
      
      // GitHub Integration Environment Variables
      const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
      const GITHUB_REPO = process.env.GITHUB_REPO; // e.g., "username/repo"
      // If your Vercel project is in a subdirectory, adjust this path if needed
      const FILE_PATH = process.env.GITHUB_FILE_PATH || 'client/public/backup.json'; 

      // 1. If GitHub credentials exist, update GitHub directly
      if (GITHUB_TOKEN && GITHUB_REPO) {
        const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;
        
        let currentData = [];
        let sha = null;
        
        // Fetch current file from GitHub
        const getRes = await fetch(url, {
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (getRes.ok) {
          const fileInfo = await getRes.json();
          sha = fileInfo.sha;
          // Decode base64 content from GitHub
          const content = Buffer.from(fileInfo.content, 'base64').toString('utf8');
          if (content.trim() !== '') {
            currentData = JSON.parse(content);
          }
        } else if (getRes.status !== 404) {
           throw new Error('Failed to fetch from GitHub: ' + await getRes.text());
        }

        // Add new inquiry
        currentData.unshift(newData);

        // Push back to GitHub
        const newContentBase64 = Buffer.from(JSON.stringify(currentData, null, 2)).toString('base64');
        
        const putRes = await fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `Auto-backup: Added new inquiry for ${newData.studentName || 'Student'}`,
            content: newContentBase64,
            sha: sha // required to update an existing file
          })
        });

        if (!putRes.ok) {
          throw new Error('Failed to push to GitHub: ' + await putRes.text());
        }

        return res.status(200).json({ success: true, message: 'Backup updated on GitHub successfully' });
      }

      // 2. FALLBACK: Local file update (for local development only)
      const filePath = path.join(process.cwd(), 'public', 'backup.json');
      let backup = [];
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        if (fileContent.trim() !== '') {
          backup = JSON.parse(fileContent);
        }
      }
      backup.unshift(newData);
      fs.writeFileSync(filePath, JSON.stringify(backup, null, 2));
      
      res.status(200).json({ success: true, message: 'Backup updated locally (GitHub credentials missing)' });

    } catch (error) {
      console.error('Backup error:', error);
      res.status(500).json({ success: false, error: 'Failed to update backup file.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
