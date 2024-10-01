  // Function to generate a random hex color
  export  function generateRandomColor() : string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);

  };