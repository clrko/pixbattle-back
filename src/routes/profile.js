const express = require('express')

const checkToken = require('../helper/checkToken')
const connection = require('../helper/db')

const router = express.Router()

router.get('/', checkToken, (req, res) => {
  const sqlUserInfos =
    `SELECT COUNT(winner_user_id) AS victories
    FROM user AS u
    LEFT JOIN battle AS b
      ON u.user_id = b.winner_user_id
    WHERE user_id = ?`
  const valueUserId = [req.user.userId]
  connection.query(sqlUserInfos, valueUserId, (err, userInfos) => {
    if (err) throw err
    if (!userInfos[0]) {
      const sqlNumberPhotosUser = 'SELECT count(*) AS nb_photos FROM photo WHERE user_id = ?'
      connection.query(sqlNumberPhotosUser, valueUserId, (err, nbPhotos) => {
        if (err) throw err
        const sqlNumberGroupsUser = 'SELECT count(*) AS nb_groups FROM user_group WHERE user_id = ?'
        connection.query(sqlNumberGroupsUser, valueUserId, (err, nbGroups) => {
          if (err) throw err
          const sqlNumberBattlesUser = 'SELECT count(*) AS nb_battles FROM user_battle WHERE user_id = ?'
          connection.query(sqlNumberBattlesUser, valueUserId, (err, nbBattles) => {
            if (err) throw err
            const allInfos = {
              nbPhotos,
              nbGroups,
              nbBattles
            }
            res.status(200).send(allInfos)
          })
        })
      })
    }
    if (userInfos[0]) {
      const infos = userInfos[0]
      const sqlNumberPhotosUser = 'SELECT count(*) AS nb_photos FROM photo WHERE user_id = ?'
      connection.query(sqlNumberPhotosUser, valueUserId, (err, nbPhotos) => {
        if (err) throw err
        const sqlNumberGroupsUser = 'SELECT count(*) AS nb_groups FROM user_group WHERE user_id = ?'
        connection.query(sqlNumberGroupsUser, valueUserId, (err, nbGroups) => {
          if (err) throw err
          const sqlNumberBattlesUser = 'SELECT count(*) AS nb_battles FROM user_battle WHERE user_id = ?'
          connection.query(sqlNumberBattlesUser, valueUserId, (err, nbBattles) => {
            if (err) throw err
            const allInfos = {
              infos,
              nbPhotos,
              nbGroups,
              nbBattles
            }
            res.status(200).send(allInfos)
          })
        })
      })
    }
  })
})

router.get('/my-ranking', checkToken, (req, res) => {
  const userId = [req.user.userId]
  const sql =
    `SELECT u.user_id, u.username, a.avatar_url, COUNT(winner_user_id) AS victories
    FROM user AS u
    INNER JOIN avatar AS a
      ON u.avatar_id = a.avatar_id
    LEFT JOIN battle AS b
      ON u.user_id = b.winner_user_id
    WHERE u.user_id IN 
    (SELECT DISTINCT ugr.user_id AS contacts
    FROM user_group AS ugr
    WHERE ugr.group_id IN (SELECT ug.group_id FROM user_group AS ug WHERE user_id = ?))
    GROUP BY u.user_id
    ORDER BY victories DESC`
  connection.query(sql, userId, (err, result) => {
    if (err) throw err
    res.status(200).send(result)
  })
})

router.get('/avatars', checkToken, (req, res) => {
  const sql = 'SELECT * FROM avatar'
  connection.query(sql, (err, avatars) => {
    if (err) throw err
    res.status(200).send(avatars)
  })
})

router.put('/settings/informations', checkToken, (req, res) => {
  const userId = req.user.userId
  const avatarId = req.body.selectedAvatar
  const username = req.body.newUsername
  if (avatarId && username) {
    const valuesToUpdate = [
      username,
      avatarId,
      userId
    ]
    const sqlToUpdate =
      `UPDATE user
      SET 
        username = ?,
        avatar_id = ?
      WHERE user_id = ?`
    connection.query(sqlToUpdate, valuesToUpdate, err => {
      if (err) throw err
      res.sendStatus(201)
    })
  } else if (avatarId && !username) {
    const valuesAvatar = [
      avatarId,
      userId
    ]
    const sqlAvatar = 'UPDATE user SET avatar_id = ? WHERE user_id = ?'
    connection.query(sqlAvatar, valuesAvatar, err => {
      if (err) throw err
      res.sendStatus(201)
    })
  } else {
    const valuesUsername = [
      username,
      userId
    ]
    const sqlUsername = 'UPDATE user SET username = ? WHERE user_id = ?'
    connection.query(sqlUsername, valuesUsername, err => {
      if (err) throw err
      res.sendStatus(201)
    })
  }
})

module.exports = router
