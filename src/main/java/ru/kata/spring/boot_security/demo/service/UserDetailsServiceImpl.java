package ru.kata.spring.boot_security.demo.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.dto.DTOUser;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;


import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;

    @Autowired
    public UserDetailsServiceImpl(UserRepository userRepository,
                                  RoleRepository roleRepository,
                                  PasswordEncoder passwordEncoder,
                                  RoleService roleService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleService = roleService;
    }
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("Пользователь не найден: " + email);
        }
        user.getRoles().size();
        return user;
    }

    @Override
    public User createUser(DTOUser dto) {
        Set<Role> roles = new HashSet<>(roleService.getRolesByIds(dto.getRolesSelected()));
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRoles(roles);
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public void saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public User updateUser(DTOUser dto) {
        User existingUser = userRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        existingUser.setName(dto.getName());
        existingUser.setEmail(dto.getEmail());

        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(dto.getPassword()));
        }


        Set<Role> roles = new HashSet<>(roleService.getRolesByIds(dto.getRolesSelected()));
        existingUser.setRoles(roles);

        return userRepository.save(existingUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    @Transactional
    public User getUser(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    @Override
    @Transactional(readOnly = true)
    public User findByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.getRoles().size(); // Принудительная инициализация ролей (если lazy)
        }
        return user;
    }
    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

}
