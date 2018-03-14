exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('projects', function(table) {
      table.increments('id').primary();
      table.string('project');
      table.timestamps(true, true);
    })
  ]),
  knex.schema.createTable('palettes', function(table) {
    table.increments('id').primary();
    table.string('palette_name');
    table.integer('project_id').unsigned()
    table.foreign('project_id')
      .references('projects.id');
    table.specificType('palette', 'text[]');
    table.timestamps(true, true);
  })
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('projects'),
    knex.schema.dropTable('palettes')
  ]);
};

// exports.up = function(knex, Promise) {
//   return Promise.all([
//     knex.schema.createTable('papers', function(table) {
//       table.increments('id').primary();
//       table.string('title');
//       table.string('author');

//       table.timestamps(true, true);
//     }),

//     knex.schema.createTable('footnotes', function(table) {
//       table.increments('id').primary();
//       table.string('note');
//       table.integer('paper_id').unsigned()
//       table.foreign('paper_id')
//         .references('papers.id');

//       table.timestamps(true, true);
//     })
//   ])
// };