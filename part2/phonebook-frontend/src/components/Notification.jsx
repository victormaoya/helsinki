const Notification = ({ message, errorMessage }) => {
  if (message === '') {
    return null
  }

  return (
    <div className={errorMessage ? 'error': 'notification'}>
      {message}
    </div>
  )
}

export default Notification