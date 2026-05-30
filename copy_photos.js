const fs = require('fs');
const path = require('path');

const sourceDir = '/Users/jared/Software Developement/da-tuition-website/DA Photos';
const destDir = '/Users/jared/Software Developement/da-tuition-website/public/images/v3';

const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.JPG') && !f.includes('(1)'));

const requiredNames = [
  'classroom_active.jpg',
  'teacher_whiteboard.jpg',
  'modern_classroom.jpg',
  'smiling_teacher.jpg',
  'teacher_screen.jpg',
  'small_group_tutoring.jpg',
  'collaborative_learning.jpg',
  'success_medal.jpg',
  'group_shot.jpg',
  'warm_interaction.jpg',
  'primary_school.jpg',
  'high_energy_class.jpg',
  'hallway_students.jpg',
  'teamwork_mural.jpg'
];

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

requiredNames.forEach((name, i) => {
  if (i < files.length) {
    fs.copyFileSync(path.join(sourceDir, files[i]), path.join(destDir, name));
    console.log(`Copied ${files[i]} to ${name}`);
  }
});
