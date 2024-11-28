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
