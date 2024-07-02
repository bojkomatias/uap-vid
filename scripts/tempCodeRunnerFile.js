
// console.log('Prepared protocols for update:', protocolsForMongo.length)

// for (const p of protocolsForMongo) {
//     try {
//         const result = await protocolCollection.updateOne(
//             { _id: new ObjectId(p._id) },
//             {
//                 $set: {
//                     'sections.identification.academicUnitIds':
//                         p.sections.identification.academicUnitIds,
//                 },
//             }
//         )
//         console.log(
//             `Updated protocol ${p._id}: ${result.modifiedCount} document modified`
//         )
//     } catch (error) {
//         console.error(`Error updating protocol ${p._id}:`, error)
//     }
// }
