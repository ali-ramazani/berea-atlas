// Initialize Supabase Client
const SUPABASE_URL = 'https://your-supabase-url.supabase.co'; // Replace with your Supabase URL
const SUPABASE_KEY = 'your-supabase-anon-key'; // Replace with your Supabase Key
const supabase = window.supabase.createClient('https://zmoxmkrybpriedydgapv.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptb3hta3J5YnByaWVkeWRnYXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3MDM5NjUsImV4cCI6MjA0OTI3OTk2NX0.RRgLnQMtC_dEygSRw-BO2DVZUhEFNce2vGrf-w2MNRw');

// DOM Elements
const pinInput = document.getElementById('pin');
const authenticateBtn = document.getElementById('authenticate-btn');
const updateSection = document.getElementById('update-section');
const updateForm = document.getElementById('update-form');
const messageDiv = document.getElementById('message');

// Authenticate PIN
authenticateBtn.addEventListener('click', async () => {
  const pin = pinInput.value.trim();

  if (!pin) {
    messageDiv.textContent = 'Please enter a PIN.';
    return;
  }

  // Check PIN in Supabase
  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .eq('pin', pin)
    .single();

  if (error || !data) {
    messageDiv.textContent = 'Invalid PIN. Please try again.';
    return;
  }

  // Populate form with professor data_hydration
  messageDiv.textContent = '';
  updateSection.style.display = 'block';
  document.getElementById('name').value = data.name || '';
  document.getElementById('office').value = data.office || '';
  document.getElementById('building').value = data.building || '';
  document.getElementById('department').value = data.department || '';
  document.getElementById('office_hours').value = data.office_hours || '';
});

// Submit Updated Information
updateForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const pin = pinInput.value.trim();
  const updatedData = {
    name: document.getElementById('name').value,
    office: document.getElementById('office').value,
    building: document.getElementById('building').value,
    department: document.getElementById('department').value,
    office_hours: document.getElementById('office_hours').value,
  };

  // Update data_hydration in Supabase
  const { error } = await supabase
    .from('faculty')
    .update(updatedData)
    .eq('pin', pin);

  if (error) {
    messageDiv.textContent = 'Failed to update information. Please try again.';
  } else {
    messageDiv.textContent = 'Information updated successfully!';
    updateSection.style.display = 'none';
  }
});
