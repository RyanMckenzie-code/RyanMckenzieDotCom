// Keep the homepage preview from showing past performances.
const showToday = new Date();
showToday.setHours(0, 0, 0, 0);
document.querySelectorAll('[data-show-date]').forEach((show) => {
  const [year, month, day] = show.dataset.showDate.split('-').map(Number);
  if (new Date(year, month - 1, day) < showToday) show.remove();
});
const homeShowList = document.querySelector('.warm-show-list');
if (homeShowList && !homeShowList.children.length) {
  const message = document.createElement('p');
  message.textContent = 'More dates coming soon. Check back for the next show.';
  homeShowList.appendChild(message);
}
