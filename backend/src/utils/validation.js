function validateName(name) {
  if (!name || name.length < 20 || name.length > 60) {
    return "Name must be between 20 and 60 characters";
  }
  return null;
}

function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !pattern.test(email)) {
    return "Invalid email format";
  }
  return null;
}

function validatePassword(password) {
  if (!password || password.length < 8 || password.length > 16) {
    return "Password must be 8-16 characters";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must include at least one special character";
  }
  return null;
}

function validateAddress(address) {
  if (address && address.length > 400) {
    return "Address must be at most 400 characters";
  }
  return null;
}

function validateRating(rating) {
  if (!rating || rating < 1 || rating > 5) {
    return "Rating must be between 1 and 5";
  }
  return null;
}

module.exports = { validateName, validateEmail, validatePassword, validateAddress, validateRating };