exports.seed = function(knex, Promise) {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        knex('projects').insert({
          project: "Yoda"
        }, 'id')
        .then(project => {
          return knex('palettes').insert([
            {palette_name: "Endor",
             palette: ["#d639a8", "#b0ac19", "#0d2b29", "#377cda", "#adee3b"],
             project_id: project[0]},
            {palette_name: "Camp",
             palette: ["#1a7bc2", "#249A91", "#64eda6", "#237cda", "#adee3b"],
             project_id: project[0]}
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error=> console.log(`Error seeding data: ${error}`))
};