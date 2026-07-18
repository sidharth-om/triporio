const fetchImage = async (query) => {
  const url = 'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=' + encodeURIComponent(query);
  const res = await fetch(url).then(r => r.json());
  const pages = res.query.pages;
  const firstPage = Object.values(pages)[0];
  console.log(query + ':', firstPage.original?.source || 'Not found');
};
Promise.all([
  fetchImage('Wayanad_district'),
  fetchImage('Muzhappilangad_Drive-in_Beach'),
  fetchImage('Theyyam'),
  fetchImage('Bekal_Fort')
]);
