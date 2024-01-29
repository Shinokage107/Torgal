const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder } = require("discord.js");
const { Pagination } = require("@acegoal07/discordjs-pagination");
const { getGlamsByFilter } = require("../../src/ecScraper.js");
module.exports = {
  type: "user",
  data: new SlashCommandBuilder()
    .setName("glam")
    .setDescription("Displays Glamours form Eorzea Collection")
    .addStringOption((option) =>
      option
        .setName("order")
        .setDescription("Order By")
        .setRequired(false)
        .addChoices({ name: "Loves", value: "filter%5BorderBy%5D=loves" }, { name: "Newest", value: "filter%5BorderBy%5D=date" })
    )
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("Date Submitted")
        .setRequired(false)
        .addChoices(
          { name: "All-Time", value: "filter%5BdatePeriod%5D=all-time" },
          { name: "Last-Year", value: "filter%5BdatePeriod%5D=last-year" },
          { name: "This-Year", value: "filter%5BdatePeriod%5D=this-year" },
          { name: "Last-Month", value: "filter%5BdatePeriod%5D=last-month" },
          { name: "This-Month", value: "filter%5BdatePeriod%5D=this-month" },
          { name: "Last-Week", value: "filter%5BdatePeriod%5D=last-week" },
          { name: "This-Week", value: "filter%5BdatePeriod%5D=this-week" },
          { name: "Yesterday", value: "filter%5BdatePeriod%5D=yesterday" },
          { name: "Today", value: "filter%5BdatePeriod%5D=today" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("gender")
        .setDescription("Gender")
        .setRequired(false)
        .addChoices(
          { name: "Any", value: "filter%5Bgender%5D=any" },
          { name: "Male", value: "filter%5Bgender%5D=male" },
          { name: "Female", value: "filter%5Bgender%5D=female" }
        )
    )
    .addStringOption((option) => option.setName("search").setDescription("Search Input").setRequired(false)),
  execute: execute,
};

async function execute(interaction) {
  await interaction.deferReply();

  const order = interaction.options.getString("order") != null ? interaction.options.getString("order") : "filter%5BorderBy%5D=loves";
  const date = interaction.options.getString("date") != null ? interaction.options.getString("date") : "filter%5BdatePeriod%5D=this-month";
  const gender = interaction.options.getString("gender") != null ? interaction.options.getString("gender") : "filter%5Bgender%5D=any";
  const search = interaction.options.getString("search") != null ? "search=" + interaction.options.getString("search") : " ";

  const filterString = order + "&" + date + "&" + gender + "&" + search;

  await getGlamsByFilter(filterString)
    .then((response) => {
      paginateResponse(interaction, response);
    })
    .catch((e) => {
      console.log(e);
      interaction.followUp("Something went wrong <:tickno:1139024530808000582>");
    });
}

async function paginateResponse(interaction, response) {
  var pages = 20;
  var book = [];
  for (let index = 0; index < pages && index < response.length; index++) {
    const page = response[index];

    const url = page.link;
    const image = page.image;
    const title = page.title;
    const author = page.author;
    const likes = page.likes;
    const fit = page.fit.join() + " ";
    const thumbnail = "https://pbs.twimg.com/profile_images/1700498427669319680/5Py3t105_400x400.png";

    var print = new EmbedBuilder();

    const description = "**" + author + "**" + "\n" + "Likes: " + likes + " <:heart:1201473710637465610>" + "\n" + fit;

    print.setThumbnail(thumbnail);
    print.setDescription(description);
    print.setTitle(title);
    print.setImage(image);
    print.setURL(url);

    book.push(print);
  }

  if (book.length > 0) {
    new Pagination()
      .setPortal(interaction)
      .setPageList(book)
      .enableAutoButton()
      .setProgressBar()
      .enableAuthorIndependent()
      .disableDisabledButtons()
      .setTimeout(60000)
      // .enablePrivateReply()
      .paginate();
  } else {
    interaction.followUp("Sry i was not able to find anything :c");
  }
}
