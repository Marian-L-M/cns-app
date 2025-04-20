import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

const sampleData = {
  users: [
    {
      name: `Schmohn`,
      email: `sample@askdjgsdh.com`,
      password: bcrypt.hashSync("12345", 10),
      role: Role.ADMIN,
    },
    {
      name: `Tonibert`,
      email: `normale@bronale.com`,
      password: bcrypt.hashSync("12345", 10),
      role: Role.USER,
    },
  ],
};

export default sampleData;
