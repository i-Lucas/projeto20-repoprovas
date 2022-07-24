import joi from "joi";
import { CreateTestData } from "../repositories/tests";

const create = joi.object<CreateTestData>({

  name: joi.string().required(),
  pdfUrl: joi.string().uri().required(),
  categoryId: joi.number().integer().required(),
  teacherDisciplineId: joi.number().integer().required(),
});

const testSchema = { create };
export default testSchema;