class Http {
  request (url, method = 'GET', body = null) {
    return new Request(
      url,
      {
        method,
        headers: new Headers({
          'X-Requested-With': 'XMLHttpRequest'
        }),
        body: body
      }
    )
  }

  fetchData (callback, request = {}, hasData = true) {
    fetch(request).then(response => {
      const status = [400, 404, 409] // Status for special treatment

      if (response.ok || status.includes(response.status)) {
        return response.json()
      } else {
        const error = new Error('Something went wrong on server!')
        error.response = response
        throw error
      }
    }).then(data => {
      if (typeof callback === 'function') {
        if (hasData) {
          callback(data)
        } else {
          callback()
        }
      }
    }).catch(error => console.log(error))
  }
}

export default Http
