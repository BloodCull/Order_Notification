exports.metrics = () => {
  console.log(`Server string on port: ${process.env.PORT}`);
  console.log(
    `API SPEC: ${process.env.DOMAIN}:${process.env.PORT}${process.env.SWAGGER_URL}`
  );
};
