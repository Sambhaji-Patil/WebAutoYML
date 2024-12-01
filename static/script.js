async function addWorkflow(repoFullName) {
  try {
    const response = await fetch("/add-workflow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repository: repoFullName }),
    });

    const data = await response.json();

    const notification = document.getElementById("notification");
    notification.textContent = data.success
      ? "Workflow added successfully!"
      : `Error: ${data.error}`;
    notification.className = `notification ${
      data.success ? "success" : "error"
    }`;

    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.className = "notification hidden";
    }, 3000);
  } catch (error) {
    console.error("Error:", error);
  }
}

function updateForm() {
  const cronForm = document.getElementById("cron-form");
  const selectedOption = document.getElementById("cron-options").value;
  cronForm.innerHTML = ""; // Clear previous form fields

  if (selectedOption === "hours") {
    cronForm.innerHTML = `
                    <label for="hours">Every X Hours:</label>
                    <input type="number" id="hours" min="1" placeholder="e.g., 2">
                    <button id="generate" onclick="generateCron('hours')">Generate</button>
                `;
  } else if (selectedOption === "daily") {
    cronForm.innerHTML = `
                    <label for="time">Time (24-hour format):</label>
                    <input type="number" id="time" min="0" max="23" placeholder="e.g., 9">
                    <button id="generate" onclick="generateCron('daily')">Generate</button>
                `;
  } else if (selectedOption === "weekly") {
    cronForm.innerHTML = `
                    <label for="time">Time (24-hour format):</label>
                    <input type="number" id="time" min="0" max="23" placeholder="e.g., 9">
                    <label for="days">Days (1-7 or comma-separated):</label>
                    <input type="text" id="days" placeholder="e.g., 1-7 or 2,4">
                    <button id="generate" onclick="generateCron('weekly')">Generate</button>
                `;
  } else if (selectedOption === "monthly") {
    cronForm.innerHTML = `
                    <label for="time">Time (24-hour format):</label>
                    <input type="number" id="time" min="0" max="23" placeholder="e.g., 9">
                    <label for="day-of-month">Day of the Month:</label>
                    <input type="number" id="day-of-month" min="1" max="31" placeholder="e.g., 15">
                    <button id="generate" onclick="generateCron('monthly')">Generate</button>
                `;
  }
}

function generateCron(option) {
  let cronExpression = "0"; // Default minute value
  if (option === "hours") {
    const hours = document.getElementById("hours").value;
    if (hours) cronExpression += ` */${hours} * * *`;
  } else if (option === "daily") {
    const time = document.getElementById("time").value;
    if (time) cronExpression += ` ${time} * * *`;
  } else if (option === "weekly") {
    const time = document.getElementById("time").value;
    const days = document.getElementById("days").value;
    if (time && days) cronExpression += ` ${time} * * ${days}`;
  } else if (option === "monthly") {
    const time = document.getElementById("time").value;
    const dayOfMonth = document.getElementById("day-of-month").value;
    if (time && dayOfMonth) cronExpression += ` ${time} ${dayOfMonth} * *`;
  }
  document.getElementById("cron-expression").value = cronExpression;
}

async function showRepoDetails(repoFullName) {
  // Fetch repo details using an API or update UI dynamically
  document.getElementById("repo-name").textContent = repoFullName;

  // Example logic for updating UI
  const status = await checkFeatureStatus(repoFullName);
  document.getElementById("feature-status").textContent = status
    ? "Enabled"
    : "Disabled";

  // Attach event listeners for buttons
  document.getElementById("delete-btn").onclick = () =>
    deleteWorkflow(repoFullName);
  document.getElementById("add-update-btn").onclick = () =>
    addOrUpdateWorkflow(repoFullName);
}

async function addOrUpdateWorkflow(repoFullName) {
  const cronExpression = document.getElementById("cron-expression").value;
  try {
    const response = await fetch("/add-workflow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repository: repoFullName, cron: cronExpression }),
    });

    const data = await response.json();

    const notification = document.getElementById("notification");
    notification.textContent = data.success
      ? "Workflow added/updated successfully!"
      : `Error: ${data.error}`;
    notification.className = `notification ${
      data.success ? "success" : "error"
    }`;

    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.className = "notification hidden";
    }, 3000);
  } catch (error) {
    console.error("Error:", error);
  }
}
async function deleteWorkflow(repoFullName) {
  try {
    const response = await fetch("/delete-workflow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repository: repoFullName }),
    });

    const data = await response.json();
    const notification = document.getElementById("notification");
    notification.textContent = data.success
      ? "Workflow deleted successfully!"
      : `Error: ${data.error}`;
    notification.className = `notification ${
      data.success ? "success" : "error"
    }`;

    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.className = "notification hidden";
    }, 3000);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function checkFeatureStatus(repoFullName) {
  // Logic to check if feature is enabled
  const response = await fetch(
    `/check-feature-status?repository=${repoFullName}`
  );
  const data = await response.json();
  return data.enabled;
}
