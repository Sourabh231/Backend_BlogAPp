const mongoose = require('mongoose');
const blogModel = require('../models/blogModel');
const userModel = require('../models/userModel');

//GET ALL BLOGS
exports.getAllBlogsController = async (req, res) => {
    try {
        const blogs = await blogModel.find({}).populate('user');
        if (!blogs) {
            return res.status(400).send({
                sucess: false,
                message: 'No Blog Found'
            })
        }
        return res.status(200).send({
            sucess: true,
            BlogCount: blogs.length,
            message: 'All Blogs sucessfully listed',
            blogs
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            sucess: false,
            message: 'Error wile Getting Blogs',
            err
        });
    }
};

//Create Blog
exports.createBlogController = async(req, res) => {
    try {
        const { title, description, image,user } = req.body;
        //validation
        if (!title || !description || !image || !user) {
            return res.status(400).send({
                sucess: false,
                message: 'Please provide all fields'
            })
        }
        const existingUser = await userModel.findById(user)
        //validation
        if(!existingUser){
            return res.status(404).send({
                sucess:false,
                message:'Unable to find user'
            })
        }
        const newBlog = new blogModel({ title, description, image,user })
        const session = await mongoose.startSession()
        session.startTransaction()
        await newBlog.save({session})
        existingUser.blogs.push(newBlog)
        await existingUser.save({session})
        await session.commitTransaction();
        await newBlog.save()
        return res.status(200).send({
            sucess: true,
            message: 'Blog Created',
            newBlog
        });
    } catch (err) {
        console.log(err)
        return res.status(400).send({
            sucess: false,
            message: 'Error while creating the Blog',
            err
        })
    }
}

//Update Blog
exports.updateblogController = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image } = req.body;
        const blog = await blogModel.findByIdAndUpdate(
            id,
            { ...req.body }, { new: true });
        return res.status(200).send({
            sucess: true,
            message: 'Blog Updated',
            blog
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            sucess: false,
            message: 'Error while updating the blog',
            err
        })
    }


}


//single Blog
exports.getBlogByIdController = async (req, res) => {
    try {
        const { id } = req.params
        const blog = await blogModel.findById(id)
        if (!blog) {
            return res.status(404).send({
                sucess: false,
                message: 'blog not found with this is'
            })
        }
        return res.status(200).send({
            sucess: true,
            message: 'fetch single blog',
            blog
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            sucess: false,
            message: 'Error while getting the single blog',
            err
        })
    }
}

//Delete Blog
exports.deleteBlogController = async (req, res) => {
    try {
        const blog = await blogModel
        // .findOneAndDelete(req.params.id)
        .findByIdAndDelete(req.params.id)
        .populate('user');
        await blog.user.blogs.pull(blog);
        await blog.user.save();
        return res.status(200).send({
            sucess: true,
            message: 'deleted the single blog',
            blog
        })
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            sucess: false,
            message: 'Error while deleteing the single blog',
            err
        })
    }
}

//GET USER BLOG
exports.userBlogController = async(req,res)=>{
    try{
        const userBlog = await userModel.findById(req.params.id).populate('blogs')
        if(!userBlog){
            return res.status(404).send({
                sucess:false,
                message:'blogs not found with this id'
            })
        }
        return res.status(200).send({
            sucess:true,
            message:'user blogs',
            userBlog
        })
    }catch(err){
        console.log(err);
        return res.status(400).send({
            sucess:false,
            message:'Error in user blog',
            err
        })
    }
}