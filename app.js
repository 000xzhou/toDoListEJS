const express = require("express")
const ejs = require("ejs")
const mongoose = require("mongoose")

const app = express()
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }))
const path = require('path');
const e = require("express");
app.use(express.static(__dirname + '/public'));

const port = 3000
const home = "/"
// const work = "/work"
// const about = "/about"
const deleteList = "/delete"

// Mongo uri
const uri = 'all your db here'



// CLOUD DATABASE START
mongoose.connect(uri);

const itemsSchema = {
    list: String,
    type: String
}

const Item = mongoose.model("Item", itemsSchema)
// Starting Items
const item1 = new Item({
    list: "Welcome",
    type: "List"
})
const item2 = new Item({
    list: "Hit the + button to add an item",
    type: "List"
})
const item3 = new Item({
    list: "<--- Hit this to delete an item",
    type: "List"
})



// Listening to port
app.listen(port, () => {
    console.log(`starting port ${port}`)
});

// HOME
app.get(home, (req, res) => {
    Item.find({ type: "List" }, function (err, finditems) {
        if (err) {
            console.log(err);
        } else {
            // console.log(finditems)
            if (finditems.length === 0) {
                Item.insertMany([item1, item2, item3])
                res.redirect(home)  // <-- can never have empty todolist if this is here. but it will also not delete the last one if it's not
            } else {
                res.render('list', { listTitle: "List", newListItems: finditems }); // Where index.ejs is your ejs template
            }
        }

    })

});

app.post(home, (req, res) => {
    const itemName = req.body.newItem
    const listName = req.body.list  //look for the button name list and the vaule inside
    // console.log(itemName)

    // UGH....
    const item = new Item({
        list: itemName,
        type: listName
    })
    if (req.body.list !== "List") {
        Item.find({ type: listName }, function (err, finditems) {
            item.save()
            res.redirect(listName)
        })
    } else {
        const itemList = req.body.newItem
        item.save()
        res.redirect(home)
    }

})

// OTHER 
app.get("/:customListName", (req, res) => {
    // req.params.customListName    <= is w.e custom name they add after the url
    const customListName = req.params.customListName
    Item.find({ type: customListName }, function (err, finditems) {
        if (err) {
            console.log(err);
        } else {
            res.render("list", { listTitle: customListName, newListItems: finditems })
        }

    })

})

// DELETE
app.post(deleteList, (req, res) => {
    const itemID = req.body.checkbox
    const HiddenValue = req.body.HiddenValue
    console.log(HiddenValue)
    // A.findByIdAndRemove(id, options, callback)
    Item.findByIdAndRemove(itemID, (err) => {
        if (!err) {
            console.log(`deleted ${itemID}`)
            res.redirect(HiddenValue)
        }
    })
})
