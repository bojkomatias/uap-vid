    // for (const question of questions) {
    //   try {
    //     const result = await review_question_collection.insertOne({
    //       active: question.active,
    //       type: question.type,
    //       question: question.question,
    //     })
    //     console.log(
    //       `Created review question ${result._id}: ${result.modifiedCount} document modified`
    //     )
    //   } catch (error) {
    //     console.error(`Error creating review question ${review._id}:`, error)
    //   }
    // }