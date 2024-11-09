const express = require("express");
const router = express.Router();
const animalController = require("../controllers/animalController");
const {
  addAnimalValidation,
  validateForm,
} = require("../middlewares/formValidation");

router.post(
  "/add-animal",
  addAnimalValidation(),
  validateForm,
  animalController.addAnimal
);
router.get("/all", animalController.fetchAllAnimals);
router.get("/:id", animalController.getAnimalById);
router.delete("/:id", animalController.deleteAnimal);
router.get(
  "/type/:type/slaughterhouseId/:slaughterhouseId",
  animalController.getAnimalTypeBySlaughterhouse
);
router.get("/type/:type", animalController.getAnimalTypeByAdmin);
router.put("/:id", animalController.updateAnimal);
router.get(
  "/search/:name/type/:type/slaughterhouseId/:slaughterhouseId",
  animalController.searchAnimals
);
router.get("/search/customer/:name", animalController.searchCustomer);
router.get(
  "/slaughterhouse/:slaughterhouseId",
  animalController.getAnimalsBySlaughterhouse
);

router.get(
  "/filter/:status/slaughterhouseId/:slaughterhouseId",
  animalController.filterByStatus
);
router.get(
  "/transaction/:slaughterhouseId",
  animalController.getTransactionBySlaughterhouse
);
router.get(
  "/filter/:startDate/:endDate/slaughterhouseId/:slaughterhouseId",
  animalController.filterByDateRange
);

module.exports = router;
