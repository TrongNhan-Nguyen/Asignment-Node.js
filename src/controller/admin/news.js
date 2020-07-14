const News = require("../../model/News");
const fs = require("fs");
// Create News
const createNews = async (req, res, next) => {
  try {
    const news = new News({
      ...req.body,
      img: req.file.filename,
    });
    await news.save();
    res.redirect("/admin/news");
  } catch (error) {
    return req.send(error.message);
  }
};
// Delete News
const deleteNews = async (req, res, next) => {
  try {
    const { newsID } = req.params;
    const news = await News.findById(newsID);
    fs.unlink("src/public/uploads/news/" + news.img, (err, data) => {
      if (err);
    });
    await News.findByIdAndRemove(newsID);
    return res.redirect("/admin/news");
  } catch (error) {
    return res.send(error.message);
  }
};
// Form Add
const formAdd = async (req, res, next) => {
  try {
    const { user } = req.session;
    if (user && user.type === "Admin") {
      return res.render("admin/add_news");
    }
    return res.send("Page not found");
  } catch (error) {
    return req.send(error.message);
  }
};
// Get news
const editNews = async (req, res, next) => {
  try {
    const { newsID } = req.params;
    const news = await News.findById(newsID);
    return res.render("admin/edit_news", { news });
  } catch (error) {
    return res.send(error.message);
  }
};
// Get list news
const getNewsList = async (req, res, next) => {
  try {
    const { user } = req.session;
    if (user && user.type === "Admin") {
      const learning = await News.find({ type: "Learning" });
      const activities = await News.find({ type: "Activities" });
      const fees = await News.find({ type: "Fees" });
      return res.render("admin/news", { learning, activities, fees });
    }
    return res.send("Page not found");
  } catch (error) {
    return res.send(error.message);
  }
};
// Update News
const updateNews = async (req, res, next) => {
  try {
    const { newsID } = req.params;
    const foundNews = await News.findById(newsID);
    const file = req.file;
    var img;
    if (file) {
      img = req.file.filename;
      fs.unlink("src/public/uploads/news/" + foundNews.img, (err, data) => {
        if (err) console.log(err);
      });
    } else {
      img = foundNews.img;
    }
    await News.findByIdAndUpdate(newsID, {
      ...req.body,
      img,
    });
    return res.redirect("/admin/news");
  } catch (error) {
    res.send(error.message);
  }
};
module.exports = {
  createNews,
  deleteNews,
  editNews,
  formAdd,
  getNewsList,
  updateNews,
};
