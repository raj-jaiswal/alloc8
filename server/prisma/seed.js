import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import available_rooms from "../../data-gen/available_rooms.json" with { type: "json" };

async function main() {}

main()
  .then(async () => {
    const data = new Set();
    for (let batch in available_rooms) {
      for (let gender in available_rooms[batch]) {
        let capacity = available_rooms[batch][gender]["capacity"];
        for (let hostel in available_rooms[batch][gender]["hostels"]) {
          console.log("adding for", batch, gender, hostel, capacity);
          for (let floor in available_rooms[batch][gender]["hostels"][hostel]) {
            for (let room of available_rooms[batch][gender]["hostels"][hostel][floor]) {
              //   console.log(
              //     `${hostel}-${
              //       floor.toString() + room.toString().padStart(2, "0")
              //     }`
              //   );
              // ids.push(
              //   `${hostel}-${
              //     floor.toString() + room.toString().padStart(2, "0")
              //   }-${batch}`
              // );
              console.log(
                `${hostel}-${floor}${room.toString().padStart(2, "0")}-${
                  batch
                }`
              );
              data.add(
                JSON.stringify({
                  roomId: `${hostel}-${floor}${room.toString().padStart(2, "0")}-${
                    batch
                  }`,
                  hostel,
                  gender,
                  floor,
                  roomNum: `${floor}${room.toString().padStart(2, "0")}`,
                  batch,
                  capacity,
                  numFilled: 0,
                  students: [],
                  roommateCode: "",
                })
              );
            }
          }
        }
      }
    }

    const findDuplicates = (arr) => {
      let sorted_arr = arr.slice().sort(); // You can define the comparing function here.
      // JS by default uses a crappy string compare.
      // (we use slice to clone the array so the
      // original array won't be modified)
      let results = [];
      for (let i = 0; i < sorted_arr.length - 1; i++) {
        if (sorted_arr[i + 1] == sorted_arr[i]) {
          results.push(sorted_arr[i]);
        }
      }
      return results;
    };
    const finalData = [];
    const ids = [];
    for (const x of data) {
      console.log(JSON.parse(x).roomId);
      ids.push(JSON.parse(x).roomId);
      finalData.push(JSON.parse(x));
    }
    console.log(
      "duplicate IDs",
      findDuplicates(ids),
      ", ids length: ",
      ids.length
    );
    const createMany = await prisma.rooms.createMany({
      data: finalData,
    });
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
/* vi: set et sw=2: */
