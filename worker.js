const Bull = require('bull');
const imageThumbnail = require('image-thumbnail');
const UserModel = require('./models/UserModel');
const FileModel = require('./models/FileModel');

// Create queues
const fileQueue = new Bull('fileQueue');
const userQueue = new Bull('userQueue');

// Process fileQueue for thumbnail generation
fileQueue.process(async (job) => {
    const { userId, fileId } = job.data;

    if (!fileId) throw new Error('Missing fileId');
    if (!userId) throw new Error('Missing userId');

    const file = await FileModel.findOne({ _id: fileId, userId });
    if (!file) throw new Error('File not found');

    // Generate thumbnails
    const sizes = [500, 250, 100];
    for (const size of sizes) {
        const thumbnail = await imageThumbnail(file.path, { width: size });
        // Save thumbnail with a new name or overwrite
        fs.writeFileSync(file.path.replace(/\.(\w+)$/, `_${size}.$1`), thumbnail);
    }
});

// Process userQueue for sending welcome emails
userQueue.process(async (job) => {
    const { userId } = job.data;

    if (!userId) throw new Error('Missing userId');

    const user = await UserModel.findById(userId);
    if (!user) throw new Error('User not found');

    console.log(`Welcome ${user.email}!`);
});

module.exports = { fileQueue, userQueue };
