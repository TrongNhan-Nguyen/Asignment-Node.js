const News = require("../../model/News");
const fs = require("fs");
var user,notActive=0;
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
    if (news.img) {
      fs.unlink("src/public/uploads/news/" + news.img, (err, data) => {
        if (err);
      });
    }
    await News.findByIdAndRemove(newsID);
    return res.redirect("/admin/news");
  } catch (error) {
    return res.send(error.message);
  }
};
// Form Add
const formAdd = async (req, res, next) => {
  try {
    if (user && user.type === "Admin") {
      return res.render("admin/add_news",{user,notActive});
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
    return res.render("admin/edit_news", { news,user,notActive });
  } catch (error) {
    return res.send(error.message);
  }
};
// Get list news
const getNewsList = async (req, res, next) => {
  try {
    user = req.session.user;
    notActive = 0;
    user.inbox.forEach((item) => {
      if (item.active == false) {
        notActive++;
      }
    });
    if (user && (user.type==="Admin" || user.type==="Lecturer")) {
      const learning = await News.find({ type: "Learning" });
      const activities = await News.find({ type: "Activities" });
      const fees = await News.find({ type: "Fees" });
      return res.render("admin/news", { learning, activities, fees,user,notActive });
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
      if (foundNews.img) {
        fs.unlink("src/public/uploads/news/" + foundNews.img, (err, data) => {
          if (err) console.log(err);
        });
      }
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
