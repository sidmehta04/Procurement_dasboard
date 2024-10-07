// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  update,
  set,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPw2XrDvYMu49IiWJmEEUFL6O2Zb2kyIg",
  authDomain: "clinic-inventory-e77e6.firebaseapp.com",
  databaseURL: "https://clinic-inventory-e77e6-default-rtdb.firebaseio.com",
  projectId: "clinic-inventory-e77e6",
  storageBucket: "clinic-inventory-e77e6.appspot.com",
  messagingSenderId: "28860646838",
  appId: "1:28860646838:web:200b70eba27855ca712d17",
};

// Initialize Firebase
let app;
let database;

try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// Function to import clinics from CSV
function importClinicsFromCSV() {
  const fileInput = document.getElementById('csvFileInput');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select a CSV file.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    const lines = content.split('\n');
    let clinicsData = {};
    let addedCount = 0;

    console.log(`Total lines in CSV: ${lines.length}`);

    // Skip the header row if it exists
    for (let i = 1; i < lines.length; i++) {
      const clinicCode = lines[i].split(',')[0].trim();
      if (clinicCode) {
        clinicsData[clinicCode] = true;  // Simply set to true instead of an object
        addedCount++;
      }
    }

    console.log(`Clinics to be added: ${addedCount}`);
    console.log('Clinics data:', clinicsData);

    // Add all clinics at once
    const clinicsRef = ref(database, 'clinics');
    update(clinicsRef, clinicsData)
      .then(() => {
        console.log('Clinics added successfully to database');
        alert(`Import complete. Added or updated ${addedCount} clinics.`);
        if (typeof fetchClinicData === 'function') {
          fetchClinicData();
        }
      })
      .catch((error) => {
        console.error('Error adding clinics to database:', error);
        alert(`Error occurred while adding clinics. Check console for details.`);
      });
  };

  reader.onerror = function(e) {
    console.error('Error reading file:', e);
    alert('Error reading the file. Please try again.');
  };

  reader.readAsText(file);
}

// Test function to add a single clinic
function testAddClinic() {
  const testClinicRef = ref(database, 'clinics/test2');
  set(testClinicRef, true)  // Simply set to true instead of an object
    .then(() => {
      console.log('Test clinic added successfully');
      alert('Test clinic added successfully. Check Firebase console.');
    })
    .catch((error) => {
      console.error('Error adding test clinic:', error);
      alert('Error adding test clinic. Check console for details.');
    });
}

// Function to fetch and display clinic data
function fetchClinicData() {
  const clinicsRef = ref(database, 'clinics');
  get(clinicsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const clinics = snapshot.val();
        console.log('Fetched clinics:', clinics);
        alert(`Fetched ${Object.keys(clinics).length} clinics. Check console for details.`);
      } else {
        console.log('No clinics found in database');
        alert('No clinics found in database.');
      }
    })
    .catch((error) => {
      console.error('Error fetching clinics:', error);
      alert('Error fetching clinics. Check console for details.');
    });
}

// Function to delete clinics starting with an integer
function deleteIntegerClinics() {
    const clinicsRef = ref(database, 'clinics');
    get(clinicsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const clinics = snapshot.val();
          const clinicsToDelete = {};
          let deleteCount = 0;
  
          for (let clinic in clinics) {
            if (clinic.match(/^\d/)) {
              clinicsToDelete[clinic] = null;  // Set to null to delete
              deleteCount++;
            }
          }
  
          if (deleteCount > 0) {
            update(clinicsRef, clinicsToDelete)
              .then(() => {
                console.log(`${deleteCount} clinics starting with an integer deleted`);
                alert(`Deleted ${deleteCount} clinics that start with an integer.`);
                fetchClinicData();  // Refresh the clinic list
              })
              .catch((error) => {
                console.error('Error deleting clinics:', error);
                alert('Error occurred while deleting clinics. Check console for details.');
              });
          } else {
            console.log('No clinics starting with an integer found');
            alert('No clinics starting with an integer found.');
          }
        } else {
          console.log('No clinics found in database');
          alert('No clinics found in database.');
        }
      })
      .catch((error) => {
        console.error('Error fetching clinics:', error);
        alert('Error fetching clinics. Check console for details.');
      });
  }
  

// Export functions to window object
window.importClinicsFromCSV = importClinicsFromCSV;
window.testAddClinic = testAddClinic;
window.fetchClinicData = fetchClinicData;
window.deleteIntegerClinics = deleteIntegerClinics;

// Log when the script has finished loading
console.log('Clinic import script loaded successfully');