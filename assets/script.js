// Check if the user has previously entered a name
let savedName = localStorage.getItem('userName');
if (savedName) {
    document.getElementById('popupName').value = savedName;
    displayEnteredName();
}

// Check if the user has previously selected an image
let userImage = localStorage.getItem('userImage');
if (userImage) {
    document.getElementById('fallbackImage').style.display = 'none';
    document.getElementById('userImage').style.display = 'block';
    document.getElementById('userImage').src = userImage;
}

let cameraStream;

// Open the popup and start the camera
function openPopup() {
    const namePopup = document.getElementById('namePopup');
    namePopup.style.display = 'block';

    startCamera();
}

// Start the camera
async function startCamera() {
    try {
        // Access the camera stream
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });

        // Display the video stream in the popup
        const videoElement = document.getElementById('cameraVideo');
        videoElement.srcObject = cameraStream;
    } catch (error) {
        console.error('Error accessing the camera:', error);
        alert('Error accessing the camera. Please check your camera permissions.');
    }
}

// Capture an image from the camera
function captureImage() {
    if (cameraStream) {
        // Capture a frame from the video stream and convert it to base64
        const canvas = document.createElement('canvas');
        const videoElement = document.getElementById('cameraVideo');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL('image/png');

        // Save the base64 image in local storage
        localStorage.setItem('userImage', base64Image);

        // Display the captured image in the main section
        document.getElementById('fallbackImage').style.display = 'none';
        document.getElementById('userImage').style.display = 'block';
        document.getElementById('userImage').src = base64Image;

        // Close the popup
        closePopup();
    }
}

// Replace the captured image with the live camera feed in the popup
function replaceImage() {
    startCamera();
}

// Save the name from the popup
function savePopupName() {
    const popupNameInput = document.getElementById('popupName');
    const nameDisplay = document.getElementById('nameDisplay');

    // Validate the name input
    const popupNameValue = popupNameInput.value.trim();
    if (/^[a-zA-Z\s]*$/.test(popupNameValue) && popupNameValue.length <= 30) {
        // Save the valid name in local storage
        localStorage.setItem('userName', popupNameValue);
        alert('Name saved successfully!');
        displayEnteredName();
        closePopup();
    } else {
        alert('Invalid name! Only letters allowed, and maximum 30 characters.');
    }
}

// Close the popup and stop the camera
function closePopup() {
    const namePopup = document.getElementById('namePopup');
    namePopup.style.display = 'none';

    stopCamera();
}

// Stop the camera
function stopCamera() {
    if (cameraStream) {
        const tracks = cameraStream.getTracks();
        tracks.forEach(track => track.stop());
    }
}

// Function to download the image
function downloadImage() {
    // Get the user image data
    const userImageElement = document.getElementById('userImage');
    const canvas = document.createElement('canvas');
    canvas.width = userImageElement.width;
    canvas.height = userImageElement.height;
    const context = canvas.getContext('2d');
    context.drawImage(userImageElement, 0, 0, canvas.width, canvas.height);

    // Convert the canvas content to data URL
    const dataUrl = canvas.toDataURL('image/png');

    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'userImage.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Function to save data
function saveData() {
    // Display the entered name and image
    const nameDisplay = document.getElementById('nameDisplay');
    const savedName = localStorage.getItem('userName');
    const savedImage = localStorage.getItem('userImage');

    if (savedName && savedImage) {
        nameDisplay.innerText = savedName;
        document.getElementById('fallbackImage').style.display = 'none';
        document.getElementById('userImage').style.display = 'block';
        document.getElementById('userImage').src = savedImage;
    } else {
        alert('Please enter a name and capture an image first.');
    }
}

// Function to display entered name dynamically
function displayEnteredName() {
    const nameDisplay = document.getElementById('nameDisplay');
    const nameInput = document.getElementById('popupName');
    nameDisplay.innerText = nameInput.value.trim() || 'Name';
}
