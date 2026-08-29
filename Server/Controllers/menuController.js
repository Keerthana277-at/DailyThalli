const Menu = require("../models/Menu");

const createMenuItem = async (req,res) => {
    try{
        const {name,description,price,category,available} = req.body;

        const menuItem = new Menu({
            name,
            description,
            price,
            category,
            available
        });

        const saveMenuItem = await menuItem.save();

        return res.status(201).json({
            message:"Menu item created successfully",
            menuItem:saveMenuItem
        });
    }catch(error){
        return res.status(500).json({
            message:"Server error"
        });
    }
};

const getMenuItems = async (req,res) => {
    try{
        const menuItems = await Menu.find().sort({ createdAt:-1 });

        return res.status(200).json({
            message:"menu items fetched successfully",
            menuItems
        });
    }catch(error){
        console.log("Get menu error:",error.message);
        return res.status(500).json({
            message:"Server error"
        });
    }
};

const getMenuItemsByID = async (req,res) => {
    try{
         const menuItem = await Menu.findById(req.params.id);

        if(!menuItem)
            return res.status(404).json({
                message:"Menu item not found",
            })
        return res.status(200).json({
            message:"Fetched successfully",
            menuItem
        });  
    }catch(error){
        console.log("Server error:",error.message);
        return res.status(500).json({
            
            message:"Server error"
            
        })
    }
     
}

const updateMenuItem = async (req, res) => {
    try {
        console.log("1. Update request received");
        console.log("ID:", req.params.id);
        console.log("Body:", req.body);

        const menuItem = await Menu.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found"
            });
        }

        menuItem.name = req.body.name ?? menuItem.name;
        menuItem.description = req.body.description ?? menuItem.description;
        menuItem.price = req.body.price ?? menuItem.price;
        menuItem.category = req.body.category ?? menuItem.category;
        menuItem.available = req.body.available ?? menuItem.available;

        const updatedMenuItem = await menuItem.save();

        console.log("2. Database update completed");

        return res.status(200).json({
            message: "Menu item updated successfully",
            menuItem: updatedMenuItem
        });

    } catch (error) {
        console.log("Update Menu Error:", error.message);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteItem = async (req,res) => {
    try{
        const menuItem = await Menu.findByIdAndDelete(req.params.id);
        if(!menuItem)
            return res.status(404).json({
                message:"Menu item not found"
            })

        return res.status(200).json({
            message:"Menu item deleted successfully"
        });    
    }catch(error){
        console.log("Delete error:",error.message);
        return res.status(500).josn({
            message:"Server error"
        })
    }
    
};

module.exports = {
    createMenuItem,
    getMenuItems,
    getMenuItemsByID,
    updateMenuItem,
    deleteItem
};

