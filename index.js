'use strict';

const qb = require('aqb');

/**
 * Arangodb Query Builder Pagination.
 *
 * Provides an easy means for adding sorting and pagination to aqb queries.
 *
 * @param {aqb} query - Query to append to.
 * @param {string|collection} doc - AQL variable to append sort varialbes to.
 * @param {Object} params - Request query parameters.
 * @param {string} [params.sort] - Comma delimited fields to sort by.
 *                                 Use ` desc` after field name for descending.
 * @param {Number} [params.page=1] - Page to display.
 * @param {Number} [params.per_page=30] - Number of records per page.
 * @returns {aqb} Appended aqb object.
 *
 * @example
 * const qb = require('aqb');
 * const paginate = require('aqb-paginate');
 * const doc = 'doc';
 * let query = qb.for(doc).in(collection);
 * let params = {
 *   sort: 'date, name desc',
 *   per_page: 100,
 *   page: 5
 * }
 * query = paginate(query, doc, params)
 *
 * @example
 * // Used in a Foxx router
 * router.get('/paginated', function (req, res) {
 *   const doc = 'doc';
 *   let query = qb.for(doc).in(collection);
 *   query = paginate(query, doc, req.queryParams);
 *   res.send(db._query(query.return(doc).toAQL()));
 * })
**/
function paginate(query, doc, { sort, page=1, per_page=30 }) {
  if (sort) {
    let fields = sort.split(',');
    fields.forEach(f => {
      let [field, order] = f.split(' ');
      query = query.sort(`${doc}.${field}`, order);
    });
  }

  if (per_page || page) {
    let skip = (page - 1) * per_page;
    query = query.limit(skip, per_page);
  }

  return query;
}

module.exports = paginate;
