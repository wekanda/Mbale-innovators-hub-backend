// scripts/seed_via_api.js
// Seeds sample projects by calling the deployed backend API using admin auth

async function apiRequest(method, url, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

(async () => {
  const base = 'https://mbale-innovators-hub-backend-1.onrender.com/api';

  // Login as admin
  const login = await apiRequest('POST', base + '/auth/login', { email: 'admin@mbalehub.com', password: 'Admin@12345' });
  if (!login || !login.token) {
    console.error('Admin login failed:', login);
    return;
  }
  const token = login.token;
  console.log('Logged in as admin, seeding projects...');

  const samples = [
    {
      title: 'Smart Irrigation System',
      description: 'An IoT-based irrigation system that automates watering schedules using soil moisture sensors.',
      category: 'Agriculture',
      technologies: ['Arduino', 'Node.js', 'MQTT'],
      githubLink: 'https://github.com/example/smart-irrigation'
    },
    {
      title: 'E-Learning Platform for Rural Schools',
      description: 'A lightweight e-learning app tailored for low-bandwidth environments.',
      category: 'Education',
      technologies: ['React', 'Firebase'],
      githubLink: 'https://github.com/example/e-learner'
    },
    {
      title: 'Health Appointment Tracker',
      description: 'A simple app to manage medical appointments and reminders for clinics.',
      category: 'Health',
      technologies: ['Vue', 'Express', 'MongoDB'],
      githubLink: 'https://github.com/example/health-tracker'
    }
  ];

  for (const s of samples) {
    const res = await apiRequest('POST', base + '/projects', s, token);
    console.log('Created project:', res && res.success ? res.data?.title || s.title : res);
  }

  const list = await apiRequest('GET', base + '/projects?limit=10', null, null);
  console.log('\nProjects listing after seeding:', JSON.stringify(list, null, 2));
})();
