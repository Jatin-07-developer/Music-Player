import api from './client'

export function getAllMusics() {
  return api.get('/music')
}

export function getAllAlbums() {
  return api.get('/music/albums')
}

export function getAlbumById(albumId) {
  return api.get(`/music/albums/${albumId}`)
}

export function uploadMusic({ title, file }) {
  const form = new FormData()
  form.append('title', title)
  form.append('music', file)
  return api.post('/music/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function createAlbum({ title, musicIds }) {
  return api.post('/music/album', { title, musicIds })
}
