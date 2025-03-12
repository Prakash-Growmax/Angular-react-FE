import("./bootstrap")
  .then(({ mount }) => {
    mount();
  })
  .catch((err) => console.error("Error bootstrapping app:", err));
