const aws = require('aws-sdk')
const express= require('express')
const multer = require('multer ')
const multerS3 = require('multer-s3')
const uuid = require('uuid').v4;
const postDB = require('../models/post')
const path = require('path')
