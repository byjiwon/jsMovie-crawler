const axios = require("axios");
const cheerio = require("cheerio");

const getHTML = async () => {
  try {
    const response = await axios.get(
      "https://movie.naver.com/movie/running/current.nhn"
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

getHTML().then(html => {
  let ulList = [];
  const $ = cheerio.load(html.data);
  const $bodyList = $("div.lst_wrap ul").children("li");
  $bodyList.map(function(i) {
    const getThumb = $(this)
      .find("div.thumb a img")
      .attr("src");

    const getTitle = $(this)
      .find("dl.lst_dsc dt a")
      .text();

    const getRate = $(this)
      .find("span.num")
      .first()
      .text();

    let genres = [];
    const getGenres = $(this)
      .find("span.link_txt")
      .first()
      .children();
    getGenres.each(function(i, elem) {
      genres[i] = $(this).text();
    });
    genres.join(", ");

    let advanceRate = [];
    const getAdvanceRate = $(this)
      .find("div.star_t1")
      .last()
      .children();
    getAdvanceRate.each(function(i) {
      advanceRate[i] = $(this).text();
    });
    advanceRate = advanceRate[0] + "%";

    let directors = [];
    const getDirector = $(this)
      .find("dt.tit_t2")
      .next()
      .find("a");
    getDirector.each(function(i) {
      directors[i] = $(this).text();
    });
    directors.join(", ");

    let actors = [];
    const getActor = $(this)
      .find("dt.tit_t3")
      .next()
      .find("a");
    getActor.each(function(i) {
      actors[i] = $(this).text();
    });
    actors.join(", ");

    ulList[i] = {
      thumb: getThumb,
      title: getTitle,
      rate: getRate,
      genres,
      advanceRate,
      directors,
      actors
    };
    return ulList.push(ulList[i]);
  });
  console.log(ulList);
});
